export default function fx(classes) {
  return classes
    .split(" ")
    .map((className) => {
      const [label, rest] = className.split(":");
      if (!rest) return label;
      return rest
        .split(",")
        .map((cls) => `${label}_${cls}`)
        .filter(Boolean)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
};

