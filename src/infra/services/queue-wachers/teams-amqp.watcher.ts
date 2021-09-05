import { ConsumeMessage } from 'amqplib';
import { Activity, ConversationReference, TurnContext } from 'botbuilder';
import { AmqpProvider } from '../../providers/amqp.provider';
import { BotFrameworkProvider } from '../../providers/bot-framework.provider';
import { RabbitMq } from '../../../config/config';
import { Client } from '../../../domain/enums/client.enum';
import { MessageReader } from '../../../domain/contracts/message-reader.interface';
import { Conversation, TemporaryConversation } from '../../../domain/models/conversation';
import {  Message } from '../../../domain/contracts/chatbot.interface';
import { ChatbotEngineService } from '../chatbot-engine.service';
import { EmployeeRepository } from '../../../domain/contracts/employee-repository.interface';
import { TemporaryConversationRepository } from '../../../domain/contracts/temporary_conversation-repository.interface';
import { CardBuilder } from '../../../domain/contracts/card-builder.interface';
import { SupportedAttachments } from '../../../domain/enums/supported-attachments';
import * as path from 'path'

export class TeamsAmqpWatcher implements MessageReader {
  constructor (
		private readonly chatbotEngineService: ChatbotEngineService,
		private readonly amqpProvider: AmqpProvider,
    private readonly botFrameworkProvider: BotFrameworkProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly tempConversationRepository: TemporaryConversationRepository,
    private readonly cardBuilder: CardBuilder
  ) {}

  public async read(): Promise<void> {
    const conn = await this.amqpProvider.getInstance()
    const botFramework = await this.botFrameworkProvider.getInstance()

    const channel = await conn.createChannel();

    channel.consume(RabbitMq.teamsChatbotQueue, async (message: ConsumeMessage) => {

      try {
        const data = JSON.parse(message.content.toString());
        const conversationReference = data.conversationReference as ConversationReference;
        const activity = data.activity as Activity;
        const { attachmentsFilePaths } = data;



        const attachments = attachmentsFilePaths.map(filename => {
          const ext = path.extname(filename).replace('.', '')
          return {
            icon: SupportedAttachments.Icon[ext],
            mimetype: SupportedAttachments.Mimetype[ext],
            url: `${process.env.DOMAIN_NAME}:${process.env.PORT}/files/${filename}`,
            filename: filename,
            title: filename
          }
        })
  
        let employee = await this.employeeRepository.findByToken(Client.teams, activity.from.id)
  
        let conversation: Conversation = null
  
        if (employee) {
          conversation = await this.employeeRepository.getLastConversation(employee.id)
        } else {
          conversation = await this.tempConversationRepository.getLastConversationFrom(activity.from.id)
        }
  
        const messages: Message[] = await this.chatbotEngineService.execute({
          text: activity.text,
          token: activity.from.id,
          client: Client.teams,
          employeeId: employee?.id,
          attachments: attachments
        }, conversation);
  
        if (!employee) {
          employee = await this.employeeRepository.findByToken(Client.teams, activity.from.id)
        }
  
        if (employee) {
          const conversations = messages.map(message => ({
            context: message.context.getContextCode(),
            answer: typeof message.message === 'object' ? JSON.stringify(message.message) : message.message,
            isStarted: true,
            type: 'plaintext',
            typedText: activity.text,
            attachments: message.attachments,
            intent: message.context.getIntent()
          }) as Conversation)

          console.dir(conversations, { depth: null })

          await this.employeeRepository.saveConversations(employee.id, conversations)
        } else {
          const conversations = messages.map(message => ({
            context: message.context.getContextCode(),
            answer: typeof message.message === 'object' ? JSON.stringify(message.message) : message.message,
            isStarted: true,
            from: activity.from.id,
            type: 'plaintext',
            typedText: activity.text,
            attachments: message.attachments,
          }) as TemporaryConversation)
          await this.tempConversationRepository.saveConversations(conversations)
        }
  
        for (const message of messages) {
          await botFramework.continueConversation(conversationReference, async (context: TurnContext) => {
            let activity: Partial<Activity> = null
            if (message.cardType && typeof message.message === 'object') { // card message

              // criar um builder de factory de card
              const card = await this.cardBuilder.build(message.cardType, message)
              activity = { attachments: [card] }
            } else if (typeof message.message === 'string') { // string message
              activity = { text: message.message }
            } else {
              throw new Error('Invalid message!')
            }

            await context.sendActivities([
              { type: 'typing' },
              { type: 'delay', value: message.delay },
              activity
            ])
          });
        }

        channel.ack(message)
      } catch (_error) {
        channel.nack(message, false, false)
        console.log(_error)
      }
    });
  }
}
