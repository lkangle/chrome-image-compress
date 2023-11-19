/* eslint-disable */

function sleep(delay = 1e3) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

class AsyncQueue {
  constructor(callback) {
    // 正在运行的任务数量
    this.runingCount = 0;
    // 最大失败重试次数
    this.maxRetryCount = 2;
    // 最大并发数
    this.maxNumber = 10;
    // 重试延迟
    this.delay = 4e3;
    // 用户设置要执行的回调
    this.userCallback = callback;
    // 任务缓存队列
    this.cacheQueue = [];
    // 定时器的锁
    this.lock = false;

    this.invokeFunction = this.invokeFunction.bind(this);
  }

  setMax(count) {
    this.maxNumber = count;
    return this;
  }

  setDelay(delay) {
    this.delay = delay;
    return this;
  }

  setMaxRetry(retryCount) {
    this.maxRetryCount = retryCount;
    return this;
  }

  // 提交数据
  emit(...data) {
    return new Promise((resolve, reject) => {
      this.cacheQueue.push({
        retryCount: 0,
        args: data,
        resolve,
        reject
      });

      if (this.runingCount >= this.maxNumber) {
        return;
      }

      this.runTasks();
    })
  }

  runTasks(force = false) {
    if (!force && this.lock) return;
    this.lock = window.setTimeout(async () => {
      const runQueue = this.cacheQueue.splice(0, this.maxNumber - this.runingCount);
      this.runingCount += runQueue.length;

      if (this.cacheQueue.length <= 0) {
        this.lock = false;
      }
      
      // 没有任务要执行 就停止运行
      if (runQueue.length <= 0) {
        return;
      }

      // 执行一批任务
      await Promise.all(runQueue.map(this.invokeFunction));
      
      await sleep(this.delay);
      // 递归执行剩余任务
      this.runTasks(true);
    }, 100);
  }

  async invokeFunction(data) {
    let { retryCount, args, reject, resolve, error } = data;

    let isLast = retryCount === this.maxRetryCount-1
    try {
      if (retryCount < this.maxRetryCount) {
        const result = await this.userCallback.apply(undefined, [...args, isLast]);
        resolve(result);
      } else {
        reject(error);
      }
    } catch(error) {
      retryCount = retryCount + 1;
      if (retryCount >= this.maxRetryCount) {
        reject(error);
      } else {
        console.warn('[AsyncTask] 回收重试', retryCount);
        return this.cacheQueue.push({
          args: data.args,
          retryCount,
          reject,
          resolve,
          error
        });
      }
    } finally {
      this.runingCount -= 1;
    }
  }
}

export default AsyncQueue;
