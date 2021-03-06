import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async list(req, res) {
    // Validate current user as a provider
    const isProvider = await User.findOne({
      where: {
        id: req.currentUserId,
        provider: true,
      },
    });
    if (!isProvider) {
      return res.status(401).json({
        error: 'You are not allowed to view this resource.',
      });
    }

    const [date] = req.query.date.split('T');
    const parsedDate = parseISO(date);

    // Get appointments
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.currentUserId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
