import { Connection, connect } from 'amqplib';
import { RabbitMq } from '../../config/config';

export class AmqpProvider {
    private static connection: Connection = null

    async getInstance(): Promise<Connection> {
      if (!AmqpProvider.connection) {
        AmqpProvider.connection = await connect(RabbitMq.url); 
      }
      return AmqpProvider.connection
    }
}