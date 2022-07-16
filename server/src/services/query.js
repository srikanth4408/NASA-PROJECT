
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;
async function getPaginatation(query){
   const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
   const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
   const skip = (page - 1)*limit;
   //console.log(`${skip} ${limit}`);
   return {
       skip, limit,
   };
}

module.exports = { getPaginatation };