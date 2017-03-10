import { exists } from './lang';

export function mixin(klass, tomix) {

  const ptype = klass.prototype;
  const source = tomix;

  for (const name in source) {

    if (name === 'constructor') {
      throw new Error('Mixin : attempting to mixin a constructor method, aborting!');
    }

    if (exists(ptype[name])) {
      throw new Error(
             `Mixin : attempting to mixin a property '${name}' that already exists, aborting!`
           );
    }

    ptype[name] = source[name];
  }

}

export default mixin;
