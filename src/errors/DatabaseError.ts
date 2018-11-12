export default class DatabaseError extends Error {
  constructor(err: Error) {
    super(`ERROR: Louvre - ${err.message}`);
    this.name = this.constructor.name;
  }
}
