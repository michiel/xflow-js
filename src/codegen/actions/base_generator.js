class BaseGenerator {

  generateFrom() {
    this.name = this.name || 'BaseGenerator';

    throw new Error(
      `${this.name}.generateFrom : method unimplemented`
    );
  }

}

export default BaseGenerator;
