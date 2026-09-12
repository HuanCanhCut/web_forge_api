import * as models from './index'

const associations = () => {
    Object.values(models).forEach((model: any) => {
        if (model.associate) {
            model.associate(models)
        }
    })
}

export default associations
