import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Nova Encomenda',
      template: 'newDelivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
      },
    });
  }
}

export default new NewDeliveryMail();
