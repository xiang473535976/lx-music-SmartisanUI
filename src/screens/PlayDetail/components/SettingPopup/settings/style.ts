import { createStyle } from '@/utils/tools'

// 锤子风：白底 + 上下发丝线 + 红色数值
export default createStyle({
  container: {
    paddingTop: 12,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 12,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ededed',
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  label: {
    width: 54,
    color: '#E64040',
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 2,
  },
  btn: {
    flexDirection: 'row',
    marginTop: 10,
  },
})
