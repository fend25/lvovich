/* @flow */
/* eslint-disable no-use-before-define, no-continue, arrow-parens */

import { ANDROGYNOUS } from './gender';
import {
  PREPOSITIONAL,
  GENITIVE,
  constantizeGenderInRules,
  findRule,
  applyRule,
  applyMod,
} from './inclineRules';
import { inclineFirstname } from './incline';
import { frozenWords, frozenParts, frozenPartsAfter, cityRules } from './rules/cityRules';
import type { GenderStrT } from './gender';

constantizeGenderInRules(cityRules);

// предложный, в каком городе живете/находитесь?
export function cityIn(name: string, gender?: GenderStrT) {
  if (isFrozen(name, frozenWords)) return name;
  return name
    .split(/(\s|-)/g)
    .map((part, i, parts) => {
      if (isFrozenPart(part, i, parts)) return part;

      const rule = findRule(part, ANDROGYNOUS, cityRules);
      if (rule) {
        return applyRule(rule, part, PREPOSITIONAL);
      }

      return inclineFirstname(part, PREPOSITIONAL, gender) || part;
    })
    .join('');
}

// родительный, из какого города приехали?
export function cityFrom(name: string, gender?: GenderStrT) {
  if (isFrozen(name, frozenWords)) return name;
  return name
    .split(/(\s|-)/g)
    .map((part, i, parts) => {
      if (isFrozenPart(part, i, parts)) return part;

      const rule = findRule(part, ANDROGYNOUS, cityRules);
      if (rule) {
        return applyRule(rule, part, GENITIVE);
      }

      return inclineFirstname(part, GENITIVE, gender) || part;
    })
    .join('');
}

// в какой город направляетесь?
export function cityTo(name: string) {
  if (!name) return name;
  return name
    .split(/(\s|-)/g)
    .map((part, i, parts) => {
      if (isFrozenPart(part, i, parts)) return part;

      const partLower = part.toLowerCase();

      if (partLower.endsWith('а')) {
        return applyMod(part, '-у');
      } else if (partLower.endsWith('ая')) {
        return applyMod(part, '--ую');
      }

      return part;
    })
    .join('');
}

function isFrozen(str: string, words: string[]): boolean {
  const strLower = str.toLowerCase();
  for (let k = 0; k < words.length; k++) {
    if (words[k] === strLower) {
      return true;
    }
  }
  return false;
}

function isFrozenPart(part, i, parts) {
  if (parts.length > 1) {
    if (isFrozen(part, frozenParts)) return true;
    for (let k = 0; k < i; k++) {
      if (isFrozen(parts[k], frozenPartsAfter)) return true;
    }
  }
  return false;
}
