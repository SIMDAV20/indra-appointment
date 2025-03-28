import { EventBridge } from 'aws-sdk';

export class EventBridgeService {
  private eventBridge = new EventBridge();

  async sendEvent(eventDetail: any) {
    await this.eventBridge
      .putEvents({
        Entries: [
          {
            Source: 'appointment.service',
            DetailType: 'AppointmentCompleted',
            Detail: JSON.stringify(eventDetail),
            EventBusName: 'default',
          },
        ],
      })
      .promise();

    console.log(`📤 Evento enviado a EventBridge: ${eventDetail.id}`);
  }
}
