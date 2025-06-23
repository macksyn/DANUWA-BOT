const GroqStatus = {}

exports.setGroq = (jid, status, user) => {
  if (!GroqStatus[jid]) GroqStatus[jid] = {}
  GroqStatus[jid][user] = status
}

exports.getGroq = (jid, user) => {
  return GroqStatus[jid]?.[user] || false
}
