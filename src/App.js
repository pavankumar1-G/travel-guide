import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

// Replace your code here

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

const TravelGuideItem = props => {
  const {itemDetails} = props
  const {name, imageUrl, description} = itemDetails

  return (
    <li className="travel-guide-item">
      <img src={imageUrl} alt={name} className="location-image" />
      <h1 className="title-name">{name}</h1>
      <p className="description">{description}</p>
    </li>
  )
}

const TravelGuideList = props => {
  const {travelGuidedetailsList} = props

  return (
    <ul className="travel-guide-list">
      {travelGuidedetailsList.map(eachPackage => (
        <TravelGuideItem key={eachPackage.id} itemDetails={eachPackage} />
      ))}
    </ul>
  )
}

class App extends Component {
  state = {travelGuideList: [], apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getTravelGuidePackages()
  }

  getTravelGuidePackages = async () => {
    this.setState({apiStatus: apiConstants.inProgress})

    const travelGuideUrl = 'https://apis.ccbp.in/tg/packages'
    const options = {
      method: 'GET',
    }

    const travelGuideResponse = await fetch(travelGuideUrl, options)
    if (travelGuideResponse.ok) {
      const travelGuideData = await travelGuideResponse.json()
      const travelGuideConvertedData = travelGuideData.packages.map(
        eachPackage => ({
          id: eachPackage.id,
          name: eachPackage.name,
          imageUrl: eachPackage.image_url,
          description: eachPackage.description,
        }),
      )

      this.setState({
        travelGuideList: travelGuideConvertedData,
        apiStatus: apiConstants.success,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-containr">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {travelGuideList} = this.state

    return <TravelGuideList travelGuidedetailsList={travelGuideList} />
  }

  renderTravelGuideListDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoadingView()
      case apiConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="travel-guide-container">
        <h1 className="travel-guide-heading">Travel Guide</h1>
        <hr className="horizontal-line" />
        {this.renderTravelGuideListDetails()}
      </div>
    )
  }
}

export default App
