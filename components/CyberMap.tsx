import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CyberMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Create random nodes
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 4 + 2,
      type: Math.random() > 0.8 ? 'hostile' : 'neutral'
    }));

    // Draw links
    const links = [];
    for(let i=0; i<15; i++) {
        links.push({
            source: nodes[Math.floor(Math.random() * nodes.length)],
            target: nodes[Math.floor(Math.random() * nodes.length)]
        });
    }

    svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1);

    // Ping animation
    const ping = () => {
        const source = nodes[Math.floor(Math.random() * nodes.length)];
        const target = nodes[Math.floor(Math.random() * nodes.length)];
        
        svg.append('circle')
            .attr('cx', source.x)
            .attr('cy', source.y)
            .attr('r', 2)
            .attr('fill', source.type === 'hostile' ? '#ef4444' : '#10b981')
            .transition()
            .duration(1000)
            .attr('cx', target.x)
            .attr('cy', target.y)
            .remove();
    };

    const interval = setInterval(ping, 800);

    // Draw nodes
    svg.selectAll('circle.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => d.type === 'hostile' ? '#ef4444' : '#3b82f6')
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 bg-cyber-800 rounded-lg overflow-hidden border border-cyber-700 relative">
        <div className="absolute top-2 left-2 text-xs text-cyber-accent font-mono z-10">LIVE NETWORK TOPOLOGY</div>
        <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default CyberMap;
