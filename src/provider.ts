import { sendSMS } from './aws/sns';
import { sendEmail } from './aws/ses';
import { writeWhitelistCodes, readWhitelistCodes, confirmWhitelistCodes } from './aws/dynamo';

export const Provider = {
    sendSMS,
    sendEmail,
    writeWhitelistCodes,
    readWhitelistCodes,
    confirmWhitelistCodes,
}