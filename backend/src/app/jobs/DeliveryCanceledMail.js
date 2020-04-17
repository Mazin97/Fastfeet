import Mail from '../../lib/Mail';

class DeliveryCanceledMail {
  get key() {
    return 'DeliveryCanceledMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.Deliverymen.name} <${delivery.Deliverymen.email}>`,
      subject: 'Encomenda Cancelada',
      template: 'deliveryCanceled',
      context: {
        deliveryman: delivery.Deliverymen.name,
        product: delivery.product,
      },
    });
  }
}

export default new DeliveryCanceledMail();
