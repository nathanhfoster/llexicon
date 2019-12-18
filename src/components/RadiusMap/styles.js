const styles = shouldRenderLocationList => ({
  GoogleMapWrapper: {
    height: '100%',
    width: shouldRenderLocationList ? '70%' : '100%',
    gm_style_first_of_type___div_nth_child_1: { cursor: 'default !important' }
  },
  LocationListWrapper: {
    height: '100%',
    width: '30%',
    backgroundColor: 'white'
  }
})

export default styles
