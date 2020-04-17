import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryCanceledMail from '../jobs/DeliveryCanceledMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      order: [
        ['created_at', 'DESC'],
        ['updated_at', 'DESC'],
      ],
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          attributes: [
            'id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
        },
      ],
    });

    const totalPage = Math.ceil((await DeliveryProblem.count()) / 10);
    return res.json({ data: problems, page, totalPage });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.id,
      },
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const schemaBody = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string()
        .min(10)
        .max(255)
        .required(),
    });

    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id } =
      (await Delivery.findByPk(req.body.delivery_id)) || {};

    if (deliveryman_id !== Number(req.params.id)) {
      return res
        .status(401)
        .json({ error: "This delivery dosn't belongs to this deliveryman" });
    }

    const { id } = await DeliveryProblem.create(req.body);

    return res.json({
      id,
      delivery_id: req.body.delivery_id,
      description: req.body.description,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { delivery_id } =
      (await DeliveryProblem.findByPk(req.params.id)) || {};

    if (!delivery_id) {
      return res.status(400).json({ error: 'problem not found' });
    }

    const delivery =
      (await Delivery.findByPk(delivery_id, {
        include: [
          {
            model: Deliveryman,
            attributes: ['id', 'name', 'email'],
          },
        ],
      })) || {};

    if (!delivery) {
      return res.status(400).json({ error: 'delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'delivery already canceled' });
    }

    const { canceled_at } = await delivery.update({
      id: delivery_id,
      canceled_at: new Date(),
    });

    // Send email to deliveryman
    await Queue.add(DeliveryCanceledMail.key, { delivery });

    return res.json({ delivery_id, canceled_at });
  }
}

export default new DeliveryProblemController();
