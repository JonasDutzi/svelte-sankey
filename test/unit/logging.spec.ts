import { describe, it, expect, vi } from "vitest";
import { logWarning } from "../../src/lib/helper";

describe("log", () => {
  it("should return 0 if the value is 0", () => {
    const consoleMock = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    logWarning("foo");
    expect(consoleMock).toHaveBeenCalledWith("svelte-sankey: ", "foo");
  });
});
