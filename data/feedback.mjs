import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

export class Feedback extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Feedback.init({
			"uuid"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            "Firstname"       : { type: DataTypes.STRING(64),  allowNull: false },
            "lastname"       : { type: DataTypes.STRING(64),  allowNull: false },
            "email"       : { type: DataTypes.STRING(64),  allowNull: false },
            "Country"       : { type: DataTypes.STRING(64),  allowNull: false },
			"Feedback"       : { type: DataTypes.STRING(64),  allowNull: false },
			
		}, {
			"sequelize": database,
			"modelName": "Users",
			"hooks"    : {
				"afterUpdate": ModelUser._auto_update_timestamp
			}
		});
    }
    static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');}
}