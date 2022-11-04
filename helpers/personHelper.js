exports.generatePersonId = (persons) => {
  const ids = persons.map(person => person.id).sort((a, b) => {
    return a < b ? -1 : (a > b ? 1 : 0)
  })

  return ids.length === 0 ? 1 : ids[ids.length - 1] + 1
}

exports.personIsValid = (person) => {
  return person.name == null ? false : true
}
