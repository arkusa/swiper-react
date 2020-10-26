# Swiper / Swiper-Item

有2种模式
- normal
- 无缝(从第一个跳转到第三个, 不会看到第二个swiper-item滑过)


## 无缝模式

```javascript
<Swiper seamless> // 开启无缝模式
  <Swiper-Item />
  <Swiper-Item />
</Swiper>
```

无缝模式的每个Swiper-Item堆叠在一起，当发生移动，`<Swiper>`改变`activedIndex`的时候, `Swiper-Item`自动计算它应该处于的位置，然后滑动

这是无缝的核心逻辑

## Swiper-Item

`Swiper-Item`用来做适当的逻辑划分
