import { describe, it, expect, vi } from "vitest";
import { logWarning } from "../../src/lib/helper";

describe("log", () => {
  it("should log a warning with a prefix", () => {
    const consoleMock = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    logWarning("foo");
    expect(consoleMock).toHaveBeenCalledWith("svelte-sankey-test: ", "foo");
  });
});
