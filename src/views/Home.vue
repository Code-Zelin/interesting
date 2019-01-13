<template>
  <div class="page-wrapper">
    <div class="page page-1"  v-if="page===0">
      <div class="page-1-top">
        <div class="page-1-title"></div>
        <div class="page-1-subhead"></div>
      </div>
      <div class="page-1-btn" @click="pageNext"></div>
    </div>

    <div class="page page-2" v-else-if="page===1">
      <div class="page-2-title"></div>

      <div class="page-2-count-down">
        <div
          class="page-2-count-down-item"
          style="background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/3.png)"
        ></div>
        <div
          class="page-2-count-down-item"
          style="background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/2.png)"
        ></div>
        <div
          class="page-2-count-down-item"
          style="background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/1.png)"
        ></div>
        <div
          class="page-2-count-down-item"
          style="background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/start.png)"
        ></div>
      </div>
    </div>

    <div class="page page-3" v-else-if="page===2">
      <div class="page-3-title">
        <span>{{index + 1}}</span>
        {{topic.content}}
      </div>
      <div
        class="page-3-options"
        v-for="(item, index) in topic.options"
        :key="index"
        :option="item"
        @click="selectOption(item)"
      >
        <span>{{item}}</span>
      </div>

      <div class="page-3-count-down">
        <div class="page-3-count-down-line" :style="{ width: residueWidth + 'rem' }"></div>
        <span>{{residueTime}}s</span>
      </div>
    </div>

    <div class="page page-4" v-else>
      <div class="page-4-title">
        <div class="page-4-icon"></div>
      </div>

      <div class="page-4-content">
        <div v-for="(item, index) in result" :key="index">
          <div class="page-4-result-title">{{item.title}}</div>
          <div class="page-4-result-content">{{item.content}}</div>
        </div>
      </div>

      <div class="page-4-again page-4-btn" @click="gameAgain">再来一次</div>

      <div class="page-4-share page-4-btn">立即分享</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import axios from 'axios';


interface ITopic {
  index?: number;
  content: string;
  options: string[];
  answer: string;
}

@Component({})
export default class Home extends Vue {
  /**
   * 页面的初始数据
   */
  @Provide() private countDown: string = '1';
  @Provide() private page: number = 0;
  @Provide() private residueTime: number = 60;
  @Provide() private topic: ITopic | any = null;
  @Provide() private index: number = 0;
  @Provide() private countDownTimer: any = null;

  @Provide() private topicList: ITopic[] = [];
  @Provide() private topicRightNumber: number = 0;
  @Provide() private result: object[] = [];

  get residueWidth() {
    return (this.residueTime / 60 * 511) / 100;
  }

  /**
   * 生命周期函数--监听页面加载
   */
  private created(options: any) {
    const that = this;
    axios.get('https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/getExercises.json', {})
      .then((res) => {
      // console.log(res);
      that.topicList = res.data.data;
    });
  }

  private pageNext() {
    this.page++;
    switch (this.page) {
      case 1:
        this.showPage2();
        break;
      case 2:
        this.showPage3();
        break;
      case 3:
        this.showPage4();
        break;
      default:
        break;
    }
  }

  private showPage2() {
    setTimeout(() => {
      this.pageNext();
    }, 3800);
  }

  private showPage3() {
    const topicIndex: any = localStorage.getItem('topicIndex') ? parseInt(localStorage.getItem('topicIndex') || '0') + 1 : 0;
    const topic = Object.assign({ index: topicIndex }, this.topicList[topicIndex]);
    this.topicRightNumber = 0;
    this.topic = topic;
    this.index = 0;
    this.residueTime = 60;
    this.countDownStart();
  }

  private showPage4() {
    const topicTime: any = localStorage.getItem('topicTime');
    const topicRightNumber: any = localStorage.getItem('topicRightNumber');
    let complateAvgTime: any = topicRightNumber === '0' ? 0 : topicTime / topicRightNumber;
    complateAvgTime = complateAvgTime.toFixed(1);

    this.result = [
        {
          title: '本局答对',
          content: `${topicRightNumber}题`,
        },
        {
          title: '完成一题平均需要',
          content: `${complateAvgTime}秒`,
        },
        {
          title: '击败',
          content: `${topicRightNumber > 33 ? 100 : topicRightNumber * 3}%的挑战者`,
        },
      ];
  }

  private selectOption(option: any) {
    const { topic } = this;
    let newTopic = null;
    /**
     * 判断点击的选项内容和答案是否一致
     * 若一致 则换下一题
     * 若不一致，则跳转到下一页，并将这一题的答案存至本地，方便下次调用
     */
    setTimeout(() => {
      if (option === topic.answer) {
        console.log(1);
        let index = topic.index + 1;
        if (index > this.topicList.length) {
          index = 0;
        }
        newTopic = Object.assign({
          index,
        }, this.topicList[index]);
        this.topicRightNumber ++;
        this.topic = newTopic;
        this.index = this.index + 1;
      } else {
        this.gameOver();
      }
    }, 500);
  }

  private gameOver() {
    clearInterval(this.countDownTimer);
    localStorage.setItem('topicIndex', this.topic.index);
    localStorage.setItem('topicRightNumber', `${this.topicRightNumber}`);
    localStorage.setItem('topicTime', `${60 - this.residueTime}`);
    this.pageNext();
  }

  private countDownStart() {
    this.countDownTimer = setInterval(() => {
      this.residueTime = this.residueTime - 1;
      if (this.residueTime === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  private gameAgain() {
    this.page = 1;
    this.showPage2();
  }
}
</script>


<style lang="scss" scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .page {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #6c4b3a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
  }
  .page-1 {
    justify-content: start;
    padding-top: 2rem;
  }

  .page-1-top {
    width: 5.50rem;
    height: 3.40rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/top-bg.png) no-repeat center;
    background-size: contain;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-items: center;
    margin-bottom: 1.00rem;
  }
  .page-1-title, .page-2-title {
    width: 3.50rem;
    height: .70rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/text-1.png) no-repeat center;
    background-size: contain;
    margin-bottom: .40rem;
  }
  .page-1-subhead {
    width: 3.10rem;
    height: .55rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/text-2.png) no-repeat center;
    background-size: contain;
  }
  .page-1-btn {
    width: 2.70rem;
    height: 1.10rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/go.png) no-repeat center;
    background-size: contain;
  }

  .page-2-title {
    margin-bottom: 2.00rem;
  }
  .page-2-count-down {
    width: 5.00rem;
    height: 2.61rem;
    position: relative;
  }
  .page-2-count-down-item {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 2.61rem;
    width: 1.37rem;
    background: no-repeat center;
    background-size: contain;
    animation: countDownAn 1s;
    opacity: 0;
    transform: translate(-50%, -50%) scale(3);
  }
  .page-2-count-down-item:nth-child(1) {
    animation-delay: 0;
  }
  .page-2-count-down-item:nth-child(2) {
    animation-delay: 1s;
  }
  .page-2-count-down-item:nth-child(3) {
    animation-delay: 2s;
  }
  .page-2-count-down-item:nth-child(4) {
    animation-delay: 3s;
    width: 4.92rem;
    height: 1.65rem;
  }

  @keyframes countDownAn {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(3);
    }
    60% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .page-3 {
    justify-content: start;
    padding-top: .60rem;
  }
  .page-3-title {
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/title.png) no-repeat center;
    background-size: contain;
    width: 5.63rem;
    height: 1.57rem;
    position: relative;
    color: #fff5d4;
    padding: .30rem .60rem .30rem .70rem;
    box-sizing: border-box;
    line-height: 2;
    font-size: .28rem;
    margin-bottom: .30rem;
  }
  .page-3-title span {
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/title-before.png) no-repeat center;
    background-size: contain;
    width: .70rem;
    height: .70rem;
    position: absolute;
    top: 50%;
    left: -.12rem;
    transform: translateY(-50%);
    color: #855a43;
    font-size: .30rem;
    line-height: .70rem;
    text-align: center;
    font-weight: bold;
  }

  .page-3-options {
    width: 5.40rem;
    height: 1.26rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/btn-default.png) no-repeat center;
    background-size: contain;
    box-sizing: border-box;
    margin-bottom: .32rem;
    position: relative;
  }
  .page-3-options span {
    width: 4.80rem;
    font-size: .28rem;
    color: #604333;
    line-height: 1.5;
    position: absolute;
    left: .40rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .page-3-options.error {
    background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/btn-error.png);
  }
  .page-3-options.success {
    background-image: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/btn-success.png);
  }

  .page-3-count-down {
    width: 5.52rem;
    height: .52rem;
    position: relative;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/time-line-bg.png) no-repeat center;
    background-size: contain;
    margin-top: .60rem;
  }
  .page-3-count-down-line {
    content: '';
    display: block;
    width: 5.11rem;
    height: .34rem;
    position: absolute;
    left: .32rem;
    top: .08rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/time-line.png) no-repeat center;
    background-size: 5.11rem .34rem;
  }
  .page-3-count-down span {
    position: absolute;
    right: .20rem;
    top: -.02rem;
    color: #fff;
    font-weight: bold;
    font-size: .24rem;
    height: .52rem;
    line-height: .52rem;
  }
  .page-3-count-down::after {
    content: '';
    display: block;
    position: absolute;
    width: .86rem;
    height: 1.09rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/clock.png) no-repeat center;
    background-size: contain;
    left: 0;
    top: -.28rem;
  }


  .page-4 {
    display: block;
    padding-top: 2rem;
    font-size: .28rem;
  }
  .page-4-title {
    width: 4.70rem;
    height: .91rem;
    position: relative;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/gameover.png) no-repeat center right;
    background-size: contain;
    margin: 0 auto;
  }
  .page-4-icon {
    width: .59rem;
    height: .84rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/over.png) no-repeat center right;
    background-size: contain;
    position: absolute;
    left: 0;
    top: 3%;
    opacity: 0;
    transform: translateY(-200%) scaleY(2);
    animation: page4IconAn .5s linear forwards;
  }
  @keyframes page4IconAn {
    0% {
      opacity: 0;
      transform: translateY(-100%) scale(.6, 2);
    }
    40% {
      opacity: 1;
      transform: translateY(30%) scale(1.4, .6);
    }
    70% {
      opacity: 1;
      transform: translateY(-100%) scale(.8, 1.4);
    }
    100% {
      opacity: 1;
      transform: translateY(0%) scale(1);
    }
  }

  .page-4-content {
    width: 5.64rem;
    height: 5.55rem;
    background: url(https://qsgdmj.oss-cn-shenzhen.aliyuncs.com/static/mini-program/images/bt/result-bg.png) no-repeat center;
    background-size: contain;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-items: center;
    font-size: .40rem;
    line-height: 1;
    margin: .50rem auto;
    padding-top: .60rem;
    box-sizing:border-box;
  }
  .page-4-result-title {
    color: #6e4e3c;
    margin-bottom: .26rem;
  }
  .page-4-result-content {
    color: #0dacac;
    font-weight: bold;
    margin-bottom: .60rem;
  }

  .page-4-btn {
    width: 4.00rem;
    border-radius: .40rem;
    height: .80rem;
    line-height: .80rem;
    color: #fff;
    text-align: center;
    margin: 0 auto;
    box-shadow: .05rem .05rem .30rem 0rem rgba(0, 0, 0, .2);
  }
  .page-4-again {
    background: #ffc300;
  }
  .page-4-share {
    margin-top: .40rem;
    background: #b7e96c;
  }
</style>

