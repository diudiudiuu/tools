package main

import (
	"bytes"
	"fmt"
	"net/http"
	"net/url"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gin-gonic/gin"
)

type ResponseWriter struct {
	body       string
	statusCode int
}

func (w *ResponseWriter) Header() http.Header {
	return http.Header{}
}

func (w *ResponseWriter) Write(b []byte) (int, error) {
	w.body = string(b)
	return len(b), nil
}

func (w *ResponseWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// 生成http.Request对象
	requestURL := request.Path
	if len(request.QueryStringParameters) > 0 {
		queryParams := url.Values{}
		for k, v := range request.QueryStringParameters {
			queryParams.Add(k, v)
		}
		requestURL += "?" + queryParams.Encode()
	}

	req, _ := http.NewRequest(request.HTTPMethod, requestURL, bytes.NewBuffer([]byte(request.Body)))

	// 设置header
	for k, v := range request.Headers {
		req.Header.Set(k, v)
	}

	// 初始化gin框架
	router := InitApiRouter()

	// 调用gin框架的ServeHTTP方法
	w := &ResponseWriter{}
	router.ServeHTTP(w, req)

	// 获取gin框架的返回值
	body := w.body
	statusCode := w.statusCode

	// 返回API Gateway响应
	return events.APIGatewayProxyResponse{
		Body:       body,
		StatusCode: statusCode,
	}, nil
}

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func hello(c *gin.Context) {
	name := c.Query("name")
	age := c.Query("age")

	c.JSON(http.StatusOK, gin.H{
		"message": "GET 请求成功",
		"data":    fmt.Sprintf("name:%s,age:%s", name, age),
	})
}

func hello1(c *gin.Context) {
	var person Person

	if err := c.BindJSON(&person); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "POST 请求成功",
		"data":    person,
	})
}

func InitApiRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/user/list", hello)
	router.GET("/hello", hello)
	router.POST("/hello", hello1)
	return router
}

func main() {
	lambda.Start(handler)
}
