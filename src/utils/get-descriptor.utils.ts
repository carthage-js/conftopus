import { GetDescriptorPath } from "$project/types/get-descriptor";
import { UtilsErrors } from "$project/errors";

export function parseGetDescriptorPath(path: string): GetDescriptorPath {
  type State = "root" | "objectKey" | "arrayIndex" | "loop";

  const result: GetDescriptorPath = [];
  let state: State = "root";
  let openArrayIndex = false;
  let acc = "";
  let i = 0;

  function unexpectedChar(expected: string, current: string) {
    return UtilsErrors.codes.parseGetDescriptorPath.subcodes.UnexpectedCharacter.factory(
      `We expect '${expected}' got "${current}"`,
      {
        annotations: [
          { name: "state", value: state },
          { name: "index", value: i },
        ],
      },
    );
  }

  const stateMachine: Record<State, { ingest: (c: string) => void; finish: () => void }> = {
    root: {
      ingest: (c: string) => {
        if (c === ".") {
          throw unexpectedChar(".[ ", c);
        } else if (c === "[") {
          state = "arrayIndex";
        } else if (c === " ") {
          i += 1;
        } else {
          state = "objectKey";
        }
      },
      finish: () => {
        throw UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.factory(
          "Path is empty",
        );
      },
    },
    loop: {
      ingest: (c: string) => {
        if (c === ".") {
          i += 1;
          state = "objectKey";
        } else if (c === "[") {
          state = "arrayIndex";
        } else if (c === " ") {
          i += 1;
        } else {
          throw unexpectedChar(".[ ", c);
        }
      },
      finish: () => undefined,
    },
    arrayIndex: {
      ingest: (c: string) => {
        if (!openArrayIndex) {
          // No case found where the leading character is not a '[' when we enter the arrayIndex state.
          openArrayIndex = true;
          i += 1;
        } else {
          if (c === "]") {
            if (acc === "") {
              throw UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.factory(
                "Array index is empty",
              );
            }

            result.push({
              type: "array",
              index: parseInt(acc),
            });

            acc = "";
            openArrayIndex = false;
            i += 1;
            state = "loop";
          } else if (c === " ") {
            i += 1;
          } else if (/[0-9]/.exec(c)) {
            i += 1;
            acc += c;
          } else {
            throw unexpectedChar("integer", c);
          }
        }
      },
      finish: () => {
        throw UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.factory(
          "Unclosed array index on path",
        );
      },
    },
    objectKey: {
      ingest: (c: string) => {
        if (/[A-Za-z0-9_]/.exec(c)) {
          acc += c;
          i += 1;
        } else if (c === " " && acc === "") {
          i += 1;
        } else if (c === "[" && acc === "") {
          state = "arrayIndex";
        } else if (/[ .[]/.exec(c)) {
          stateMachine.objectKey.finish();
          acc = "";
          state = "loop";
        } else {
          throw unexpectedChar("letter, number or underscode", c);
        }
      },
      finish: () => {
        if (acc === "") {
          throw UtilsErrors.codes.parseGetDescriptorPath.subcodes.InvalidSyntax.factory(
            "Empty key on path",
          );
        } else {
          result.push({
            type: "object",
            key: acc,
          });
        }
      },
    },
  };

  while (i < path.length) {
    stateMachine[state].ingest(path.charAt(i));
  }

  stateMachine[state].finish();
  return result;
}
