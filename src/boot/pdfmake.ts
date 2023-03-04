import * as pdfMake from 'pdfmake/build/pdfmake';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = vfsFonts.pdfMake.vfs;

export default pdfMake;