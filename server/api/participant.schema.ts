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
      "birthYear": {
        "type": "integer",
        "minimum": 1900,
        "maximum": 2020
      }
    },
    "required": ["firstName", "lastName", "club", "birthYear"]
  }