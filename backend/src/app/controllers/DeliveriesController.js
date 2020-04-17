import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, isBefore, parseISO } from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliveriesController {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { onlyDelivered, productName } = req.query;

    const filter = {
      deliveryman_id: req.params.id,
      end_date: onlyDelivered ? { [Op.not]: null } : null,
      canceled_at: null,
    };

    if (productName) filter.product = { [Op.iLike]: `%${productName}%` };

    const deliveries = await Delivery.findAll({
      where: filter,
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      delivery_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const schemaQuery = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schemaQuery.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (req.query.end_date && !req.file) {
      return res.status(400).json({ error: 'Signature is required' });
    }

    if (req.file && !req.query.end_date) {
      return res.status(400).json({ error: 'End date is required' });
    }

    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.findByPk(req.params.delivery_id);

    if (!delivery || delivery.deliveryman_id !== Number(req.params.id)) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (req.file && delivery.signature_id) {
      return res
        .status(400)
        .json({ error: 'Delivery already have an signature' });
    }

    if (req.query.end_date && !delivery.start_date) {
      return res.status(400).json({ error: 'Delivery must be started' });
    }

    if (
      req.query.end_date &&
      isBefore(parseISO(req.query.end_date), delivery.start_date)
    ) {
      return res
        .status(400)
        .json({ error: 'End date must be after the start date' });
    }

    const searchDate = Number(new Date());

    const deliveriesToday = await Delivery.count({
      where: {
        deliveryman_id: req.params.id,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    if (deliveriesToday >= 5) {
      return res.status(400).json({
        error: 'The deliveryman can only cannot start another delivery today.',
      });
    }

    if (req.file) {
      const { originalname: name, filename: path } = req.file;

      const { id } = await File.create({
        name,
        path,
      });

      const {
        id: delivery_id,
        product,
        canceled_at,
        start_date,
        end_date,
      } = await delivery.update({
        signature_id: id,
        end_date: req.query.end_date,
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
          {
            model: Recipient,
            attributes: ['name', 'street', 'number'],
          },
        ],
      });

      return res.json({
        delivery_id,
        product,
        canceled_at,
        start_date,
        end_date,
      });
    }

    const {
      id: delivery_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await delivery.update({
      start_date: req.query.start_date,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Recipient,
          attributes: ['name', 'street', 'number'],
        },
      ],
    });

    return res.json({
      delivery_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }
}

export default new DeliveriesController();
