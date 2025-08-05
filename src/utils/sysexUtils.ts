import _ from "lodash";
import { Message } from "webmidi";

export const isSysexDeviceEnquiryReply = (message: Message) => {
  if (!message.isSystemMessage) {
    return false
  }
  
  return message.data[3] === 0x06 && message.data[4] === 0x02
}

// Kiwitechnics
// Kiwitechnics manufacturer ID, per https://midi.org/sysexidtable
export const kiwiTechnicsSysexId = [0x00, 0x21, 0x16];
const kiwi106Identifier = [0x60, 0x03];
export const isKiwiTechnicsSysexMessage = (message: Message) => {
  const manufacturerId = message.data.slice(1, 4)
  return _.isEqual(manufacturerId, kiwiTechnicsSysexId)
}

export const isKiwi106SysexMessage = (message: Message) => {
  // message.data[6] contains device ID, but I don't think we care?
  return isKiwiTechnicsSysexMessage(message) && 
    _.isEqual(message.data.slice(4, 6), kiwi106Identifier)
}

export const isKiwi106GlobalDumpSysexMessage = (message: Message) => {
  return isKiwi106SysexMessage(message) && message.data[7] === 0x02;
}
