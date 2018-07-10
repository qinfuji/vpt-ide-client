type DOMElement = {
  style: any;
  offsetTop: number;
};

function flash(node: DOMElement, flashColor: string, baseColor: string, duration: number) {
  node.style.transition = 'none';
  node.style.backgroundColor = flashColor;
  // force recalc
  void node.offsetTop;
  node.style.transition = `background-color ${duration}s ease`;
  node.style.backgroundColor = baseColor;
}

export { flash };
