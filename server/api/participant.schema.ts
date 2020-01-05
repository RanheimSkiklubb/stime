export const participantSchema = {
    "$id": "https://stime.com/participant.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Participant",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "club": {
        "type": "string"
      },
      "eventClass": {
        "type": "string"
      }
    },
    "required": ["firstName", "lastName", "club", "eventClass"]
  }