import * as Yup from 'yup';

import { Op } from 'sequelize';
import Deliverymen from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { name, page = 1 } = req.query;

    const filter = {};

    if (name) filter.name = { [Op.iLike]: `%${name}%` };

    const deliverymen = await Deliverymen.findAll({
      where: filter,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
      offset: (page - 1) * 10,
      limit: 10,
      subQuery: false,
    });

    const totalPage = Math.ceil((await Deliverymen.count()) / 10);
    return res.json({ data: deliverymen, page, totalPage });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliverymen.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliverymen.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email } = await Deliverymen.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliverymen.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { email, avatar_id } = req.body;

    if (email && email !== deliveryman.email) {
      const exists = await Deliverymen.findOne({ where: { email } });

      if (exists) {
        return res.status(400).json({ error: 'Deliveryman already exists' });
      }
    }

    if (avatar_id) {
      const exists = await File.findByPk(avatar_id);

      if (!exists) {
        return res.status(400).json({ error: 'Avatar not found' });
      }
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({ name, email });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliverymen.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado.' });
    }

    const hasDependencies = await Delivery.findOne({
      where: { deliveryman_id: id },
    });

    if (hasDependencies) {
      return res.status(400).json({
        error: 'Este entregador possui dependências e não pode ser excluído.',
      });
    }

    await Deliverymen.destroy({ where: { id } });

    return res.json({ message: 'Deliveryman successfully deleted' });
  }
}

export default new DeliverymanController();
