const { isUpToDate } = require('vizion');

exports.checkIsUpToDate = () =>
  new Promise((resolve, reject) => {
    isUpToDate(
      {
        // fixme: only cwd
        folder: `${process.cwd()}/../`,
      },
      (err, meta) => {
        if (err) reject(err);

        resolve(meta.is_up_to_date);
      },
    );
  });
