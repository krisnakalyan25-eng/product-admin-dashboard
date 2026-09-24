

const STORAGE_KEY = "productMutations";

const getMutations = () => {
  if (typeof window === "undefined") {
    return {
      added: [],
      updated: {},
      deleted: [],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      added: [],
      updated: {},
      deleted: [],
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      added: [],
      updated: {},
      deleted: [],
    };
  }
};

const saveMutations = (mutations) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mutations));
};

export const saveAddedProduct = (product) => {
  const mutations = getMutations();

  const localProduct = {
    ...product,
    id: `local-${Date.now()}`,
  };

  mutations.added.push(localProduct);

  saveMutations(mutations);

  return localProduct;
};

export const saveUpdatedProduct = (product) => {
  const mutations = getMutations();

  const isLocalProduct = String(product.id).startsWith("local-");

  if (isLocalProduct) {
    mutations.added = mutations.added.map((existingProduct) =>
      existingProduct.id === product.id
        ? { ...existingProduct, ...product }
        : existingProduct
    );
  } else {
    mutations.updated[product.id] = product;
  }

  saveMutations(mutations);
};
export const saveDeletedProduct = (productId) => {
  const mutations = getMutations();

  if (!mutations.deleted.includes(productId)) {
    mutations.deleted.push(productId);
  }

  saveMutations(mutations);
};

export const getProductMutations = () => {
  return getMutations();
};