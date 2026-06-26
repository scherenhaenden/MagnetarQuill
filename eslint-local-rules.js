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
    }
  }
};
