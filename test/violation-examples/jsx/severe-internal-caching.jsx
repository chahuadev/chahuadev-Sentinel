//======================================================================
// SEVERE NO_INTERNAL_CACHING VIOLATIONS - JSX/React
// ระบบแคชภายในผ่าน React Hooks, Component State และ Context Caching
//======================================================================

import React, { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  useRef,
  createContext,
  useContext
} from 'react';

// VIOLATION 1: React useMemo และ useCallback สำหรับ Internal Caching
const ExpensiveCalculationComponent = ({ data, filters }) => {
  // CRITICAL: useMemo creates internal caching for expensive calculations
  const processedData = useMemo(() => {
    console.log('Processing expensive data calculation...');
    
    // Simulate expensive operation
    return data
      .filter(item => filters.category ? item.category === filters.category : true)
      .map(item => ({
        ...item,
        score: Math.random() * 100,
        processed: true,
        timestamp: Date.now()
      }))
      .sort((a, b) => b.score - a.score);
  }, [data, filters]); // CRITICAL: Dependencies create caching behavior

  // CRITICAL: useCallback caches function instances
  const handleItemClick = useCallback((itemId) => {
    console.log('Cached function called for item:', itemId);
    // Expensive function that gets cached
    const item = processedData.find(p => p.id === itemId);
    return item ? item.score * 1.5 : 0;
  }, [processedData]);

  // CRITICAL: Multiple memoized calculations
  const statistics = useMemo(() => {
    console.log('Calculating cached statistics...');
    
    const totalScore = processedData.reduce((sum, item) => sum + item.score, 0);
    const averageScore = totalScore / processedData.length;
    const maxScore = Math.max(...processedData.map(item => item.score));
    const minScore = Math.min(...processedData.map(item => item.score));
    
    return {
      total: totalScore,
      average: averageScore,
      max: maxScore,
      min: minScore,
      count: processedData.length
    };
  }, [processedData]);

  const chartData = useMemo(() => {
    console.log('Generating cached chart data...');
    
    // Expensive chart data processing
    return processedData.map((item, index) => ({
      x: index,
      y: item.score,
      label: item.name,
      color: `hsl(${item.score * 3.6}, 70%, 50%)`
    }));
  }, [processedData]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Data Analysis (Memoized)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Statistics (Cached)</h3>
        <p>Total Score: {statistics.total.toFixed(2)}</p>
        <p>Average: {statistics.average.toFixed(2)}</p>
        <p>Max: {statistics.max.toFixed(2)}</p>
        <p>Min: {statistics.min.toFixed(2)}</p>
        <p>Count: {statistics.count}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {processedData.map(item => (
          <div 
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{
              border: '1px solid #ddd',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: item.score > 50 ? '#e8f5e8' : '#f5e8e8'
            }}
          >
            <h4>{item.name}</h4>
            <p>Score: {item.score.toFixed(1)}</p>
            <p>Category: {item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// VIOLATION 2: Context-Based Caching System
const CacheContext = createContext();

const CacheProvider = ({ children }) => {
  // CRITICAL: Context used as internal cache storage
  const [cache, setCache] = useState(new Map());
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });

  const getCacheValue = useCallback((key) => {
    if (cache.has(key)) {
      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      return cache.get(key);
    } else {
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }
  }, [cache]);

  const setCacheValue = useCallback((key, value, ttl = 300000) => {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl
    };
    
    setCache(prev => new Map(prev.set(key, entry)));
  }, []);

  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    setCache(prev => {
      const newCache = new Map();
      for (const [key, entry] of prev) {
        if (now - entry.timestamp < entry.ttl) {
          newCache.set(key, entry);
        }
      }
      return newCache;
    });
  }, []);

  // CRITICAL: Automatic cache cleanup
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 60000); // Cleanup every minute
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  const contextValue = useMemo(() => ({
    getCacheValue,
    setCacheValue,
    cacheStats,
    cacheSize: cache.size
  }), [getCacheValue, setCacheValue, cacheStats, cache.size]);

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
};

// VIOLATION 3: Custom Hook ที่ใช้ Internal Caching
const useApiCache = (url, dependencies = []) => {
  const { getCacheValue, setCacheValue } = useContext(CacheContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // CRITICAL: Check cache first
    const cacheKey = `api_${url}_${JSON.stringify(dependencies)}`;
    const cachedData = getCacheValue(cacheKey);

    if (cachedData) {
      console.log('Cache hit for:', url);
      setData(cachedData.value);
      setLoading(false);
      setError(null);
      return;
    }

    console.log('Cache miss, fetching:', url);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      
      // CRITICAL: Store result in internal cache
      setCacheValue(cacheKey, result, 300000); // 5 minutes TTL
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, dependencies, getCacheValue, setCacheValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// VIOLATION 4: Component State ที่ทำหน้าที่เป็น Cache
const SearchComponent = () => {
  // CRITICAL: Component state used as search cache
  const [searchCache, setSearchCache] = useState(new Map());
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // CRITICAL: Search function with internal result caching
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    // Check cache first
    if (searchCache.has(query)) {
      console.log('Search cache hit for:', query);
      setSearchResults(searchCache.get(query));
      return;
    }

    console.log('Search cache miss, performing API call for:', query);
    setLoading(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();

      // CRITICAL: Cache search results
      setSearchCache(prev => new Map(prev.set(query, results)));
      
      // Update search history with caching
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)];
        return newHistory.slice(0, 10); // Keep last 10 searches
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchCache]);

  // CRITICAL: Debounced search with caching
  const debouncedSearch = useMemo(() => {
    let timeoutId;
    return (query) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performSearch(query), 300);
    };
  }, [performSearch]);

  const handleInputChange = (event) => {
    const query = event.target.value;
    setCurrentQuery(query);
    debouncedSearch(query);
  };

  const clearSearchCache = () => {
    setSearchCache(new Map());
    setSearchHistory([]);
    console.log('Search cache cleared');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Smart Search (Cached)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={currentQuery}
          onChange={handleInputChange}
          placeholder="Search with caching..."
          style={{
            width: '300px',
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={clearSearchCache}
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Clear Cache
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Search Results</h3>
          {loading ? (
            <p>Searching...</p>
          ) : (
            <div>
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div key={index} style={{
                    border: '1px solid #eee',
                    padding: '12px',
                    margin: '8px 0',
                    borderRadius: '4px'
                  }}>
                    <h4>{result.title}</h4>
                    <p>{result.description}</p>
                  </div>
                ))
              ) : currentQuery && (
                <p>No results found for "{currentQuery}"</p>
              )}
            </div>
          )}
        </div>

        <div style={{ width: '200px' }}>
          <h3>Search History</h3>
          <div>
            {searchHistory.map((query, index) => (
              <div 
                key={index}
                onClick={() => {
                  setCurrentQuery(query);
                  performSearch(query);
                }}
                style={{
                  padding: '4px 8px',
                  margin: '2px 0',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  fontSize: '14px'
                }}
              >
                {query}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            <p>Cache Size: {searchCache.size} queries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// VIOLATION 5: useRef สำหรับ Persistent Caching
const DataVisualization = ({ dataSource }) => {
  // CRITICAL: useRef used for persistent cache across re-renders
  const computationCache = useRef(new Map());
  const renderCache = useRef(new Map());
  const [selectedData, setSelectedData] = useState(null);

  // CRITICAL: Expensive computation with ref-based caching
  const getProcessedVisualizationData = useMemo(() => {
    return (dataType) => {
      const cacheKey = `${dataType}_${dataSource}`;
      
      if (computationCache.current.has(cacheKey)) {
        console.log('Computation cache hit for:', cacheKey);
        return computationCache.current.get(cacheKey);
      }

      console.log('Computing visualization data for:', cacheKey);
      
      // Simulate expensive computation
      const result = {
        charts: Array.from({ length: 10 }, (_, i) => ({
          id: i,
          type: dataType,
          data: Array.from({ length: 50 }, () => Math.random() * 100),
          config: {
            color: `hsl(${i * 36}, 70%, 50%)`,
            animation: true,
            responsive: true
          }
        })),
        summary: {
          total: Math.floor(Math.random() * 10000),
          average: Math.random() * 100,
          trends: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
        },
        metadata: {
          generated: Date.now(),
          dataType,
          source: dataSource
        }
      };

      // CRITICAL: Store in persistent cache
      computationCache.current.set(cacheKey, result);
      return result;
    };
  }, [dataSource]);

  // CRITICAL: Render optimization with caching
  const getCachedRenderComponent = useCallback((chartData) => {
    const renderKey = `render_${chartData.id}_${chartData.type}`;
    
    if (renderCache.current.has(renderKey)) {
      console.log('Render cache hit for chart:', chartData.id);
      return renderCache.current.get(renderKey);
    }

    console.log('Generating render component for chart:', chartData.id);
    
    const component = (
      <div 
        key={chartData.id}
        style={{
          border: '1px solid #ddd',
          padding: '16px',
          margin: '8px',
          borderRadius: '8px',
          backgroundColor: chartData.config.color.replace('50%)', '95%)'),
          cursor: 'pointer'
        }}
        onClick={() => setSelectedData(chartData)}
      >
        <h4>Chart {chartData.id}</h4>
        <p>Type: {chartData.type}</p>
        <p>Data Points: {chartData.data.length}</p>
        <div style={{
          height: '100px',
          background: `linear-gradient(45deg, ${chartData.config.color}, transparent)`,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Visualization Preview
        </div>
      </div>
    );

    // CRITICAL: Cache rendered component
    renderCache.current.set(renderKey, component);
    return component;
  }, []);

  const visualizationData = getProcessedVisualizationData('mixed');

  // CRITICAL: Cache cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Clearing visualization caches on unmount');
      computationCache.current.clear();
      renderCache.current.clear();
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Data Visualization (Heavily Cached)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Summary (Cached)</h3>
        <p>Total Records: {visualizationData.summary.total.toLocaleString()}</p>
        <p>Average Value: {visualizationData.summary.average.toFixed(2)}</p>
        <p>Trend: {visualizationData.summary.trends}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '16px' 
      }}>
        {visualizationData.charts.map(chart => getCachedRenderComponent(chart))}
      </div>

      {selectedData && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          zIndex: 1000
        }}>
          <h3>Chart Details (Cached)</h3>
          <p><strong>ID:</strong> {selectedData.id}</p>
          <p><strong>Type:</strong> {selectedData.type}</p>
          <p><strong>Data Points:</strong> {selectedData.data.length}</p>
          <p><strong>Color:</strong> {selectedData.config.color}</p>
          <button 
            onClick={() => setSelectedData(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Close
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Computation Cache: {computationCache.current.size} entries</p>
        <p>Render Cache: {renderCache.current.size} entries</p>
      </div>
    </div>
  );
};

// Main App with Cache Provider
const CachedApp = () => {
  const [currentView, setCurrentView] = useState('calculation');
  
  const sampleData = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      category: ['A', 'B', 'C'][i % 3],
      value: Math.random() * 1000
    })), []
  );

  const sampleFilters = useMemo(() => ({
    category: currentView === 'calculation' ? 'A' : null
  }), [currentView]);

  return (
    <CacheProvider>
      <div>
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
          <button 
            onClick={() => setCurrentView('calculation')}
            style={{ 
              marginRight: '10px', 
              padding: '8px 16px',
              backgroundColor: currentView === 'calculation' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Expensive Calculations
          </button>
          <button 
            onClick={() => setCurrentView('search')}
            style={{ 
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: currentView === 'search' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Smart Search
          </button>
          <button 
            onClick={() => setCurrentView('visualization')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: currentView === 'visualization' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Data Visualization
          </button>
        </nav>

        {currentView === 'calculation' && (
          <ExpensiveCalculationComponent data={sampleData} filters={sampleFilters} />
        )}
        {currentView === 'search' && <SearchComponent />}
        {currentView === 'visualization' && <DataVisualization dataSource="api" />}
      </div>
    </CacheProvider>
  );
};

export default CachedApp;