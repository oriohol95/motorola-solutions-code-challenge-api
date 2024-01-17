import { validateUser, validatePartialUser } from '../schemas/users.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => { // CRUD -> read
    const { country, region, text, page, size } = req.query
    const userList = await this.userModel.getAll({ country, region, text, page, size })

    res.json(userList)
  }

  create = async (req, res) => {
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newUser = await this.userModel.create({ input: result.data })

    res.status(201).json(newUser)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.userModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialUser(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedUser = await this.userModel.update({ id, input: result.data })

    return res.json(updatedUser)
  }
}
