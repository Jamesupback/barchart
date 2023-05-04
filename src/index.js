import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useState,useEffect } from 'react';
import * as d3 from 'd3';
const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){
  const svgref=useRef();

  const [info,setinfo] = useState([])
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
        const inform = data.data.map(item=>{
          return [item[0],item[1]]
        });
        
        setinfo(inform)
      })
  }, []);
  const information=(info.map(item=>item[1]))
  const dates=(info.map(item=>new Date(item[0])))
  console.log(dates)

  useEffect(()=>{
    const xscale=d3.scaleTime()
                  .domain([d3.min(dates),d3.max(dates)])
                  .range([50,950]);
    const yscale=d3.scaleLinear()
                  .domain([0,d3.max(information)])
                  .range([450,50])
    const svg=d3.select(svgref.current)
    const dataset=info;
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append('rect')
        .attr("x", (d, i) => xscale(new Date(d[0])))
       .attr("y", (d, i) => yscale(d[1]))
       .attr("width",3)
       .attr("height", (d, i) =>450-yscale(d[1]))
       .attr("fill", "navy")
       .attr("class", "bar")
       .attr("data-date",(d,i)=>(d[0]))
       .attr("data-gdp",(d,i)=>d[1])
       .on("mouseenter",(event,d)=>{
                        svg.append("rect")
                        .attr("id","frame")
                        .attr("x", xscale(new Date(d[0]))-100)
                        .attr("y", yscale(d[1]) - 10)
                        .attr("width", 150)
                        .attr("height", 60)
                        .attr("fill", "rgba(0, 0, 0)")
                        .attr("rx",10)
                        .attr("ry",10)
                        svg.append("text")
                        .attr("id","tooltip")
                        .attr("data-date",(d[0]))
                        .text(`Date: ${d[0]}`)
                        .attr("x", xscale(new Date(d[0]))-30)
                        .attr("y", yscale(d[1]) +10)
                        .attr("text-anchor", "middle")
                        .attr("fill", "white");
                        svg.append("text")
                        .attr("id","gdp")
                        .attr("data-date",(d[1]))
                        .text(`GDP: ${d[1]}`)
                        .attr("x", xscale(new Date(d[0]))-25)
                        .attr("y", yscale(d[1])+35)
                        .attr("text-anchor", "middle")
                        .attr("fill", "white");
       })
       .on("mouseleave",(event,d)=>{
        svg.select("#tooltip").remove()
        svg.select("#frame").remove()
        svg.select("#gdp").remove()
       })
    const yaxis=d3.axisLeft(yscale)
    svg.select('#y-axis').call(yaxis)
       .attr('transform', `translate(50,0)`)
    const xaxis=d3.axisBottom(xscale)
    svg.select('#x-axis').call(xaxis)
        .attr('transform', `translate(0,450)`)
        
  })
  
  return(
  <div id="title">
    <svg ref={svgref} width={1000} height={500}>
      <g id="x-axis"></g>
      <g id="y-axis"></g>
    </svg>
  </div>
)}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
