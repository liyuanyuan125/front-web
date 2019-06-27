import xlsxStyle from 'yxg-xlsx-style'
import { chunk } from 'lodash'

class Workbook {
  // tslint:disable-next-line:variable-name
  public SheetNames: any = []
  // tslint:disable-next-line:variable-name
  public Sheets: any = {}
}

function saveAs(obj: any, fileName: string) {
  const tmpa = document.createElement('a')
  tmpa.download = fileName || 'a'
  tmpa.href = URL.createObjectURL(obj)
  tmpa.click()
  setTimeout(() => {
      URL.revokeObjectURL(obj)
  }, 100)
}

function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

function datenum(v: any, date1904?: any) {
  if (date1904) {
    v += 1462
  }
  const epoch: any = Date.parse(v)
  const times = Date.UTC(1899, 11, 30)
  // tslint:disable-line
  return (epoch - new Date(times).getTime()) / (24 * 60 * 60 * 1000)
  // tslint:disable-line
}

function sheet_from_array_of_arrays(data: any, opts?: any) {
  const ws: any = {}
  const range: any = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }
  for (let R: any = 0; R != data.length; ++R) {
    for (let C: any = 0; C != data[R].length; ++C) {
      if (range.s.r > R) {range.s.r = R}
      if (range.s.c > C) {range.s.c = C}
      if (range.e.r < R) {range.e.r = R}
      if (range.e.c < C) {range.e.c = C}
      const cell: any = {
        v: data[R][C]
      }
      if (cell.v == null) {continue}
      const cellref = (xlsxStyle as any).utils.encode_cell({
        c: C,
        r: R
      })

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = (xlsxStyle as any).SSF._table[14]
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cellref] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = (xlsxStyle as any).utils.encode_range(range)
  }
  return ws
}

export function xlsl({
  title,
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx',
  type
}: any = {}) {
  filename = filename || 'excel-list'
  const chunks = chunk(data, 4).map((it: any) => it.length)
  data = [...data]
  data.unshift(header)
  // data.unshift(title)
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }
  const wsName: any = 'SheetJS'
  const wb: any = new Workbook()
  const ws: any = sheet_from_array_of_arrays(data)

  if (merges.length > 0) {
    if (!ws['!merges']) {
      ws['!merges'] = []
    }
    merges.forEach((item: any) => {
      ws['!merges'].push((xlsxStyle as any).utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map((row: any) => row.map((val: any) => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          wch: 12
        }
      } else if (val.toString().charCodeAt(0) > 255) {
        return {
          wch: val.toString().length * 2 + 2
        }
      } else {
        return {
          wch: val.toString().length + 2
        }
      }
    }))
    /*以第一行为初始值*/
    const result: any = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j].wch < colWidth[i][j].wch) {
          result[j].wch = colWidth[i][j].wch
        }
      }
    }
    ws['!cols'] = result
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(wsName)
  wb.Sheets[wsName] = ws
  const dataInfo = wb.Sheets[wb.SheetNames[0]]

  const borderAll = {  // 单元格外侧框线
    top: {
      style: 'thin'
    },
    bottom: {
      style: 'thin'
    },
    left: {
      style: 'thin'
    },
    right: {
      style: 'thin'
    }
  }
  for (const i in dataInfo) {
    if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1') {

    } else {
      dataInfo[i + ''].s = {
        border: borderAll,
        alignment: {
          horizontal: 'center'
        }
      }
    }
  }

  const arr: any = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1',
  'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1',
  'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1']
  const brr: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
   'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  if (merges.length > 0) {
    arr.some((v: any) => {
      const a = merges[0].split(':')
      if (v == a[0]) {
        dataInfo[v].s = {
        }
        return true
      } else {
        dataInfo[v].s = {
        }
      }
    })
  }

  // const collenght = multiHeader.length
  if (type == 1) {
    header.forEach((it: any, index: number) => {
      const ind = brr[index]
      dataInfo[`${ind}${data.length}`].s = {
        fill: {
          fgColor: {rgb: '239B56'},
        },
        font: {
          name: '宋体',
          color: {rgb: '000000'},
        },
        alignment: {
          horizontal: 'center'
        }
      }
    })
  } else {
    header.forEach((it: any, index: number) => {
      const ind = brr[index]
      dataInfo[`${ind}1`].s = {
        fill: {
          fgColor: {rgb: '3388FF'},
        },
        font: {
          name: '宋体',
          color: {rgb: '000000'},
        },
        alignment: {
          horizontal: 'center'
        }
      }
      let step = 1
      chunks.forEach((item: any) => {
        step += item
        dataInfo[`${ind}${step}`].s = {
          fill: {
            fgColor: {rgb: '239B56'},
          },
          font: {
            name: '宋体',
            color: {rgb: '000000'},
          },
          alignment: {
            horizontal: 'center'
          }
        }
      })
    })
  }
  // 设置主标题样式
  // dataInfo.A1.s = {
    // font: {
    //   name: '宋体',
    //   sz: 18,
    //   color: {rgb: 'ff0000'},
    //   bold: true,
    //   italic: false,
    //   underline: false
    // },
  //   alignment: {
  //     horizontal: 'center',
  //     vertical: 'center'
  //   }
  // }
  const wbout = (xlsxStyle as any).write(wb, {
    bookType,
    bookSST: false,
    type: 'binary'
  })

  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${filename}.${bookType}`)
}
