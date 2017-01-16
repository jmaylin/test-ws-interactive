export default class CircleMenuOverlay {
  constructor (latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
  }
}
