'use strict';

const DEFAULT_COGNITIVE_COMPLEXITY_LIMIT = 15;

function getFunctionName(node) {
  if (node.id?.name) {
    return node.id.name;
  }

  if (node.parent?.type === 'MethodDefinition' || node.parent?.type === 'PropertyDefinition') {
    return node.parent.key?.name ?? '<anonymous>';
  }

  if (node.parent?.type === 'VariableDeclarator') {
    return node.parent.id?.name ?? '<anonymous>';
  }

  return '<anonymous>';
}

function isFunctionNode(node) {
  return [
    'ArrowFunctionExpression',
    'FunctionDeclaration',
    'FunctionExpression'
  ].includes(node.type);
}

function isSortCallWithoutComparator(node) {
  return node.arguments.length === 0 &&
    node.callee?.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property?.type === 'Identifier' &&
    node.callee.property.name === 'sort';
}

function isInsertBeforeCall(node) {
  return node.callee?.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property?.type === 'Identifier' &&
    node.callee.property.name === 'insertBefore';
}

function isRemoveChildCall(node) {
  return node.callee?.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property?.type === 'Identifier' &&
    node.callee.property.name === 'removeChild';
}

function getPreferredNumberStaticMethodName(name) {
  return {
    parseInt: 'Number.parseInt',
    parseFloat: 'Number.parseFloat',
    isNaN: 'Number.isNaN',
    isFinite: 'Number.isFinite'
  }[name] ?? null;
}

function isRiskyRegexLiteral(node) {
  const raw = node.raw ?? '';
  return raw.includes('[\\s\\S]') ||
    raw.includes('.*?') ||
    (raw.includes('.*$') && node.regex?.flags?.includes('m'));
}

function getAttributeValue(attributes, attributeName) {
  const match = attributes.match(new RegExp(`\\s${attributeName}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match?.[1] ?? null;
}

function hasAttribute(attributes, attributeName) {
  return new RegExp(`\\s${attributeName}(\\s|=|$)`, 'i').test(attributes);
}

function getLineAndColumnFromIndex(text, index) {
  const lines = text.slice(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length
  };
}

module.exports = {
  rules: {
    'cognitive-complexity': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Limit function cognitive complexity before SonarQube reports it.'
        },
        schema: [
          {
            type: 'object',
            properties: {
              max: {
                type: 'integer',
                minimum: 0
              }
            },
            additionalProperties: false
          }
        ],
        messages: {
          tooComplex: 'Refactor this function to reduce its Cognitive Complexity from {{complexity}} to the {{max}} allowed.'
        }
      },
      create(context) {
        const max = context.options[0]?.max ?? DEFAULT_COGNITIVE_COMPLEXITY_LIMIT;
        const functionStack = [];

        function currentFunction() {
          return functionStack[functionStack.length - 1];
        }

        function addComplexity(node) {
          const current = currentFunction();
          if (!current) {
            return;
          }

          current.complexity += 1 + current.nesting;
          current.nodes.push(node);
        }

        function enterNesting() {
          const current = currentFunction();
          if (current) {
            current.nesting += 1;
          }
        }

        function exitNesting() {
          const current = currentFunction();
          if (current) {
            current.nesting -= 1;
          }
        }

        function enterFunction(node) {
          functionStack.push({
            node,
            complexity: 0,
            nesting: 0,
            nodes: []
          });
        }

        function exitFunction(node) {
          const current = functionStack.pop();
          if (!current || current.complexity <= max) {
            return;
          }

          context.report({
            node,
            messageId: 'tooComplex',
            data: {
              complexity: current.complexity,
              max
            }
          });
        }

        function enterControlFlow(node) {
          addComplexity(node);
          enterNesting();
        }

        return {
          ':function': enterFunction,
          ':function:exit': exitFunction,
          IfStatement: enterControlFlow,
          'IfStatement:exit': exitNesting,
          ForStatement: enterControlFlow,
          'ForStatement:exit': exitNesting,
          ForInStatement: enterControlFlow,
          'ForInStatement:exit': exitNesting,
          ForOfStatement: enterControlFlow,
          'ForOfStatement:exit': exitNesting,
          WhileStatement: enterControlFlow,
          'WhileStatement:exit': exitNesting,
          DoWhileStatement: enterControlFlow,
          'DoWhileStatement:exit': exitNesting,
          CatchClause: enterControlFlow,
          'CatchClause:exit': exitNesting,
          ConditionalExpression: enterControlFlow,
          'ConditionalExpression:exit': exitNesting,
          SwitchStatement: enterControlFlow,
          'SwitchStatement:exit': exitNesting,
          LogicalExpression(node) {
            if (['&&', '||'].includes(node.operator)) {
              addComplexity(node);
            }
          }
        };
      }
    },
    'prefer-modern-dom-before': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prefer modern ChildNode.before() over parent.insertBefore().'
        },
        schema: [],
        messages: {
          preferBefore: 'Prefer modern DOM manipulation: use referenceNode.before(node) instead of parent.insertBefore(node, referenceNode).'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            if (!isInsertBeforeCall(node)) {
              return;
            }

            context.report({
              node,
              messageId: 'preferBefore'
            });
          }
        };
      }
    },
    'prefer-modern-dom-remove': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prefer modern ChildNode.remove() over parentNode.removeChild(childNode).'
        },
        schema: [],
        messages: {
          preferRemove: 'Prefer modern DOM manipulation: use childNode.remove() instead of parentNode.removeChild(childNode).'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            if (!isRemoveChildCall(node)) {
              return;
            }

            context.report({
              node,
              messageId: 'preferRemove'
            });
          }
        };
      }
    },
    'array-sort-compare': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require an explicit comparator for Array.prototype.sort().'
        },
        schema: [],
        messages: {
          missingComparator: 'Provide a compare function to avoid sorting elements alphabetically.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            if (!isSortCallWithoutComparator(node)) {
              return;
            }

            context.report({
              node,
              messageId: 'missingComparator'
            });
          }
        };
      }
    },
    'prefer-number-static-methods': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prefer Number static methods over global numeric helpers.'
        },
        schema: [],
        messages: {
          preferNumberStatic: 'Prefer {{preferredName}} over {{name}}.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee?.type !== 'Identifier') {
              return;
            }

            const preferredName = getPreferredNumberStaticMethodName(node.callee.name);
            if (!preferredName) {
              return;
            }

            context.report({
              node: node.callee,
              messageId: 'preferNumberStatic',
              data: {
                name: node.callee.name,
                preferredName
              }
            });
          }
        };
      }
    },
    'no-risky-regex': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow regex patterns known to trigger Sonar backtracking findings.'
        },
        schema: [],
        messages: {
          riskyRegex: 'Simplify this regular expression to avoid super-linear runtime from backtracking.'
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (!node.regex || !isRiskyRegexLiteral(node)) {
              return;
            }

            context.report({
              node,
              messageId: 'riskyRegex'
            });
          }
        };
      }
    },
    'control-has-associated-label': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require input, select, and textarea controls to have an id associated with a label.'
        },
        schema: [],
        messages: {
          missingLabel: 'Add an "id" attribute to this {{tagName}} field and associate it with a label.'
        }
      },
      create(context) {
        return {
          Program() {
            const sourceCode = context.sourceCode;
            const text = sourceCode.getText();
            const controlRegex = /<(input|select|textarea)\b([^>]*)>/gi;
            let match;

            while ((match = controlRegex.exec(text)) !== null) {
              const tagName = match[1].toLowerCase();
              const attributes = match[2];

              if (tagName === 'input' && getAttributeValue(attributes, 'type')?.toLowerCase() === 'hidden') {
                continue;
              }

              if (hasAttribute(attributes, 'aria-label') || hasAttribute(attributes, 'aria-labelledby')) {
                continue;
              }

              const id = getAttributeValue(attributes, 'id');
              const labelForIdRegex = id ? new RegExp(`<label\\b[^>]*\\sfor\\s*=\\s*["']${id}["']`, 'i') : null;

              if (id && labelForIdRegex?.test(text)) {
                continue;
              }

              const loc = getLineAndColumnFromIndex(text, match.index);
              context.report({
                loc,
                messageId: 'missingLabel',
                data: {
                  tagName
                }
              });
            }
          }
        };
      }
    }
  }
};
