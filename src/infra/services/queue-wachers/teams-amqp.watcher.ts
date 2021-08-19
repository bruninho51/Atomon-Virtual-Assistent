import { ConsumeMessage } from 'amqplib';
import { Activity, ConversationReference, TurnContext } from 'botbuilder';
import { AmqpProvider } from '../../providers/amqp.provider';
import { BotFrameworkProvider } from '../../providers/bot-framework.provider';
import { RabbitMq } from '../../../config/config';
import { Clients } from '../../../domain/enums/clients.enum';
import { MessageReader } from '../../../domain/contracts/message-reader.interface';
import { Conversation, TemporaryConversation } from '../../../domain/models/conversation';
import {  Message } from '../../../domain/contracts/chatbot.interface';
import { ChatbotEngineService } from '../chatbot-engine.service';
import { EmployeeRepository } from '../../../domain/contracts/employee-repository.interface';
import { TemporaryConversationRepository } from '../../../domain/contracts/temporary_conversation-repository.interface';

export class TeamsAmqpWatcher implements MessageReader {
  constructor (
		private readonly chatbotEngineService: ChatbotEngineService,
		private readonly amqpProvider: AmqpProvider,
    private readonly botFrameworkProvider: BotFrameworkProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly tempConversationRepository: TemporaryConversationRepository,
  ) {}

  public async read(): Promise<void> {
    const conn = await this.amqpProvider.getInstance()
    const botFramework = await this.botFrameworkProvider.getInstance()

    const channel = await conn.createChannel();

    channel.consume(RabbitMq.teamsChatbotQueue, async (message: ConsumeMessage) => {
      const data = JSON.parse(message.content.toString());
      const conversationReference = data.conversationReference as ConversationReference;
      const activity = data.activity as Activity;

      let employee = await this.employeeRepository.findByToken(Clients.teams, activity.from.id)

      let conversation: Conversation = null

      if (employee) {
        conversation = await this.employeeRepository.getLastConversation(employee.id)
      } else {
        conversation = await this.tempConversationRepository.getLastConversationFrom(activity.from.id)
      }

      const messages: Message[] = await this.chatbotEngineService.execute({
        text: activity.text,
        token: activity.from.id,
        client: Clients.teams,
        employeeId: employee?.id
      }, conversation);

      if (!employee) {
        employee = await this.employeeRepository.findByToken(Clients.teams, activity.from.id)
      }

      if (employee) {
        const conversations = messages.map(message => ({
          context: message.context.getContextCode(),
          answer: message.message,
          isStarted: true,
          type: 'plaintext',
          typedText: activity.text,
        }) as Conversation)
        await this.employeeRepository.saveConversations(employee.id, conversations)
      } else {
        const conversations = messages.map(message => ({
          context: message.context.getContextCode(),
          answer: message.message,
          isStarted: true,
          from: activity.from.id,
          type: 'plaintext',
          typedText: activity.text
        }) as TemporaryConversation)
        await this.tempConversationRepository.saveConversations(conversations)
      }

      for (const message of messages) {
        await botFramework.continueConversation(conversationReference, async (context: TurnContext) => {
          await context.sendActivities([
            { type: 'typing' },
            { type: 'delay', value: message.delay },
            { text: message.message }
          ])
        }); 
      }
    });
  }
}
