import * as Yup from 'yup';

import Agendamento from '../models/Agendamento';
import User from '../models/User';

class AgendamentoController {
  async store(req,res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
        return res.status(400).json({ error: 'Validation fails'});
    }

    const { provider_id, date} = req.body;

    /**
     * Check if provider_id is a provider
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if(!checkIsProvider){
      return res.status(401).json({ error: 'You can only create agendamento with providers'});
    }

    const agendamento = await Agendamento.create({
      user_id: req.userid,
      provider_id,
      date,
    });

    return res.json(agendamento);
  }
}

export default new AgendamentoController();
