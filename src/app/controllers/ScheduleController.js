import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async list(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.currentUserId,
        provider: true,
      },
    });
    if (!isProvider) {
      res.status(401).json({
        error: 'User is not a provider.',
      });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.currentUserId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();