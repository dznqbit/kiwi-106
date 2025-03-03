import { Message } from "webmidi";

// Kiwitechnics
// Kiwitechnics manufacturer ID, per https://midi.org/sysexidtable
export const kiwiTechnicsSysexId = [0x00, 0x21, 0x16];

export const isSysexDeviceEnquiryReply = (message: Message) => {
  if (!message.isSystemMessage) {
    return false
  }
  
  return message.data[3] === 0x06 && message.data[4] === 0x02
}
