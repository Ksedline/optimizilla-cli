import logUpdate from 'log-update';
import Table from 'easy-table';

let globalData = [];

const printResult = (result) => {
  if (!globalData.length) {
    globalData = [result];
  } else {
    globalData = globalData.reduce((newArray, singleItem) => {
      if (singleItem.uniqPathId === result.uniqPathId) {
        return newArray.concat(result);
      }
      return newArray.concat(singleItem);
    }, []);

    const alreadyInTable = globalData.find(
      ({ uniqPathId }) => uniqPathId === result.uniqPathId
    );

    if (!alreadyInTable) {
      globalData = globalData.concat([result]);
    }
  }

  logUpdate(Table.print(globalData));
}

export { printResult };
