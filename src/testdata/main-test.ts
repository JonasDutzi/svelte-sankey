import { mount } from "svelte";
import TestPage from "./TestPage.svelte";

const app = mount(TestPage, { target: document.getElementById("testapp")! });

export default app;
