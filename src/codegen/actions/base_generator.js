class BaseGenerator {

  generateFrom() {
    const name = this.name || 'BaseGenerator';

    throw new Error(
      `${this.name}.generateFrom : method unimplemented`
    );
  }

}

export default BaseGenerator;
