# Selectors

Some selectors cross cut state, and they depend on other selectors, mostly
the generic ones created by the `createEntityAdapter()` API. To avoid
cyclical dependencies, we have a set of "global" selectors here.
