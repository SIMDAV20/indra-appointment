import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { EnumCountries } from 'src/domain/enums/countries.enum';

export class SNSService {
  private snsClient = new SNSClient({ region: 'us-east-1' });

  async publishMessage(
    topicArn: string,
    message: object,
    country: EnumCountries,
  ): Promise<void> {
    console.log('🚀 ~ SNSService ~ message:', message);
    try {
      const resp = await this.snsClient.send(
        new PublishCommand({
          TopicArn: topicArn,
          Message: JSON.stringify(message),
          MessageAttributes: {
            country: {
              DataType: 'String',
              StringValue: country, // Enviar el country en los atributos del mensaje
            },
          },
        }),
      );
      console.log('🚀 ~ SNSService ~ resp:', resp);
      console.log('✅ Mensaje enviado a SNS:', topicArn);
    } catch (error) {
      console.error('❌ Error al enviar mensaje a SNS:', error);
      throw new Error('Error al enviar mensaje a SNS');
    }
  }
}
