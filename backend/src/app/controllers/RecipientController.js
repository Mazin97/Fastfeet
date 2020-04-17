import * as Yup from 'yup';

import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { name, page = 1 } = req.query;

    const filter = {};

    if (name) filter.name = { [Op.iLike]: `%${name}%` };

    const recipients = await Recipient.findAll({
      where: filter,
      offset: (page - 1) * 10,
      limit: 10,
      subQuery: false,
    });

    const total = await Recipient.count({
      where: filter,
      offset: (page - 1) * 10,
      limit: 10,
      subQuery: false,
    });

    const totalPage = Math.ceil(total / 10);
    return res.json({ data: recipients, page, totalPage });
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(id);

    if (recipient) return res.json(recipient);

    return res.json({ error: 'Recipient not found or inexistent.' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome do destinatário é obrigatório'),
      street: Yup.string().required('A rua é obrigatória'),
      number: Yup.number()
        .required('O número é obrigatório')
        .positive('O número deve ser positivo')
        .integer('O número deve ser um número inteiro'),
      complement: Yup.string(),
      state: Yup.string()
        .required()
        .max(2, 'O estado deve estar escrito em forma de sigla'),
      city: Yup.string().required('A Cidade é obrigatória'),
      zip_code: Yup.string()
        .required('O CEP é obrigatório')
        .max(10, 'O CEP não pode ter mais que 10 digitos'),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      if (error.message && error.message.length) {
        return res.status(400).json({ error: error.message });
      }
    }

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Valide as informações e tente novamente.' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name, street: req.body.street },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number()
        .positive()
        .integer(),
      complement: Yup.string(),
      state: Yup.string().max(2),
      city: Yup.string(),
      zip_code: Yup.string().max(10),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { name, street } = req.body;

    if (!id || Number.isNaN(Number(id))) {
      return res.json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (name && name !== recipient.name) {
      const recipientExists = await Recipient.findOne({
        where: { name, street: recipient.street },
      });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists' });
      }
    }

    if (street && street !== recipient.street) {
      const recipientExists = await Recipient.findOne({
        where: { name: recipient.name, street },
      });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists' });
      }
    }

    const {
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name: name || recipient.name,
      street: street || recipient.street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.json({ error: 'Validation fails' });
    }

    const hasDependencies = await Delivery.findOne({
      where: { recipient_id: id },
    });

    if (hasDependencies) {
      return res.status(400).json({
        error: 'Este destinatário possui dependências e não pode ser excluído.',
      });
    }

    await Recipient.destroy({ where: { id } });

    return res.json({ message: 'Recipient successfully deleted' });
  }
}

export default new RecipientController();
